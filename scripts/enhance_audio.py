#!/usr/bin/env python3
import argparse
import json
import os
import sys
import tempfile
from pathlib import Path

try:
    import boto3
    from botocore.exceptions import BotoCoreError, ClientError
except ImportError as exc:
    sys.stderr.write("boto3 is required to run this script. Install with `pip install boto3`\n")
    raise exc

try:
    from pydub import AudioSegment, effects
except ImportError as exc:
    sys.stderr.write("pydub is required to run this script. Install with `pip install pydub`\n")
    raise exc

CONTENT_TYPE_FALLBACKS = {
    "mp3": "audio/mpeg",
    "wav": "audio/wav",
    "flac": "audio/flac",
    "ogg": "audio/ogg",
    "m4a": "audio/mp4",
    "aac": "audio/aac",
    "webm": "audio/webm"
}


def parse_args():
    parser = argparse.ArgumentParser(description="Enhance audio stored in S3 using Pydub.")
    parser.add_argument("--bucket", required=True, help="S3 bucket name")
    parser.add_argument("--region", required=True, help="AWS region for S3 client")
    parser.add_argument("--key", required=True, help="Object key of the audio file")
    parser.add_argument("--output-suffix", default="-enhanced", help="Suffix to append to the output filename (before extension)")
    parser.add_argument("--overwrite", choices=["true", "false"], default="false", help="Overwrite the source object with enhanced audio")
    parser.add_argument("--output-format", help="Optional output format (mp3, wav, etc). Defaults to source extension.")
    parser.add_argument("--bitrate", default="192k", help="Optional output bitrate for lossy formats (e.g. 192k)")
    parser.add_argument("--content-type", help="Optional content type for the uploaded object")
    return parser.parse_args()


def guess_format(key: str) -> str:
    extension = Path(key).suffix.lstrip(".").lower()
    return extension or "mp3"


def compute_output_key(source_key: str, suffix: str, overwrite: bool) -> str:
    if overwrite:
        return source_key

    path = Path(source_key)
    return str(path.with_name(f"{path.stem}{suffix}{path.suffix}"))


def enhance_audio(segment: AudioSegment) -> AudioSegment:
    # Normalize volume levels
    enhanced = effects.normalize(segment)
    # Apply gentle high/low pass filters to clean up rumble and hiss
    try:
        enhanced = enhanced.high_pass_filter(120)
        enhanced = enhanced.low_pass_filter(9000)
    except Exception:
        # Filters are optional; ignore if ffmpeg build doesn't support
        pass

    # Apply a mild dynamic range compression
    try:
        enhanced = effects.compress_dynamic_range(
            enhanced,
            threshold=-20.0,
            ratio=4.0,
            attack=5,
            release=50
        )
    except Exception:
        pass

    return enhanced


def main():
    args = parse_args()
    overwrite = args.overwrite.lower() == "true"

    s3 = boto3.client("s3", region_name=args.region)

    input_suffix = Path(args.key).suffix
    output_format = (args.output_format or guess_format(args.key)).lower()
    if output_format == "wave":  # sometimes people pass wave
        output_format = "wav"

    output_key = compute_output_key(args.key, args.output_suffix, overwrite)

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = Path(tmpdir) / ("input" + input_suffix)
        output_path = Path(tmpdir) / ("output." + output_format)

        try:
            s3.download_file(args.bucket, args.key, str(input_path))
        except (BotoCoreError, ClientError) as exc:
            sys.stderr.write(f"Failed to download s3://{args.bucket}/{args.key}: {exc}\n")
            sys.exit(1)

        try:
            original_segment = AudioSegment.from_file(input_path)
        except Exception as exc:
            sys.stderr.write(f"Pydub failed to open audio file {input_path}: {exc}\n")
            sys.exit(1)

        enhanced_segment = enhance_audio(original_segment)

        export_kwargs = {}
        if output_format in {"mp3", "ogg", "m4a", "aac", "webm"}:
            bitrate_value = args.bitrate or os.getenv("AUDIO_ENHANCEMENT_BITRATE")
            if bitrate_value:
                export_kwargs["bitrate"] = bitrate_value

        try:
            enhanced_segment.export(output_path, format=output_format, **export_kwargs)
        except Exception as exc:
            sys.stderr.write(f"Failed to export enhanced audio: {exc}\n")
            sys.exit(1)

        upload_extra_args = {}
        content_type = args.content_type or CONTENT_TYPE_FALLBACKS.get(output_format)
        if content_type:
            upload_extra_args["ContentType"] = content_type

        try:
            s3.upload_file(str(output_path), args.bucket, output_key, ExtraArgs=upload_extra_args or None)
        except (BotoCoreError, ClientError) as exc:
            sys.stderr.write(f"Failed to upload enhanced audio to s3://{args.bucket}/{output_key}: {exc}\n")
            sys.exit(1)

        result = {
            "bucket": args.bucket,
            "sourceKey": args.key,
            "enhancedKey": output_key,
            "overwrite": overwrite,
            "durationMs": len(enhanced_segment),
            "format": output_format,
            "bitrate": export_kwargs.get("bitrate"),
            "sizeBytes": output_path.stat().st_size
        }

        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()


if __name__ == "__main__":
    main()

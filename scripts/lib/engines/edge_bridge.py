"""Edge voices through the Python `edge-tts` package, for sandboxes where the
Node client cannot reach the service (it ignores the egress proxy). Reads a
job JSON {lines, voice, out, proxy}, writes line-<i>.mp3 and line-<i>.json
(word boundaries in seconds) into `out`. Used by edge.ts when EDGE_PYTHON is set.
"""
import asyncio, json, sys

import edge_tts


async def one(text, voice, proxy, mp3):
    c = edge_tts.Communicate(text, voice, proxy=proxy or None, boundary="WordBoundary")
    words = []
    with open(mp3, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
    return words


async def main(job):
    for i, text in enumerate(job["lines"]):
        for attempt in range(3):
            try:
                words = await one(text, job["voice"], job.get("proxy"), f"{job['out']}/line-{i}.mp3")
                break
            except Exception as e:  # transient empty streams: retry, never rewrite the line (§4)
                if attempt == 2:
                    raise
                print(f"  ! edge line {i + 1} attempt {attempt + 1}: {e}", file=sys.stderr)
                await asyncio.sleep(1.5 * (attempt + 1))
        with open(f"{job['out']}/line-{i}.json", "w") as f:
            json.dump(words, f)
        print(".", end="", flush=True)
    print()


asyncio.run(main(json.load(open(sys.argv[1]))))

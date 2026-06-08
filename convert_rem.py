import re
import sys

def convert_rem_to_px(match):
    val_str = match.group(1)
    val = float(val_str)
    px_val = val * 16
    
    # if it's an exact integer, format without decimals
    if px_val.is_integer():
        return f"{int(px_val)}px"
    else:
        # otherwise keep 1 or 2 decimals
        return f"{px_val:.1f}px".rstrip('0').rstrip('.')

with open("assets/css/styles.css", "r") as f:
    content = f.read()

# Replace all occurrences of <number>rem with <number*16>px
# Using \b to match numbers only or optional negative sign before digit
new_content = re.sub(r'(-?\d+(?:\.\d+)?)rem', convert_rem_to_px, content)

with open("assets/css/styles.css", "w") as f:
    f.write(new_content)

print("Conversion complete.")

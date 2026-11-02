import json
from pathlib import Path
p=Path(__file__).parent
data=json.loads((p/'data.json').read_text(encoding='utf-8'))
assert isinstance(data.get('nodes'),list) and isinstance(data.get('edges'),list)
(p/'data.js').write_text('window.HISTORY_NETWORK_DATA = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Wrote data.js')

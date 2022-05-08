# AnimePic: 识别图片特征

上传图片并查看图片的标签

python示例:

``` python3
import requests

url = 'https://api.dnlab.net/animepic/upload'
files = {'img': open("xx.jpg", 'rb')}
res = requests.post(url=url, files=files)
print(res.text)
```

## 鸣谢

- [Deep Danbooru](https://github.com/KichangKim/DeepDanbooru)

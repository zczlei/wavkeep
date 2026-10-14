# Suno Downloader API 使用文档

基于自建服务（[jine/suno-downloader](https://github.com/jine/suno-downloader)）线上实测整理。  
开发下载站前端时，按本文对接即可；**一般不必改后端**。

两条产品能力请分开看：

| 能力 | 怎么做 | 是否改后端 |
|---|---|---|
| **歌单 / 批量 → ZIP** | 本文 §4 的 `/api/download` 队列 | 接口已通，但**当前经常刮不到歌**（见下） |
| **单曲 → WAV（可选再存原文件）** | 本文 **§9 浏览器端方案**：前端解析直链 + 本机转码 | **不用动后端** |

### 现有 `suno_api` 接口能做什么（结论）

一句话：  
**接口链路是通的（建任务 / 查状态 / 分享），但当前经常「completed 却 0 首歌」，ZIP 下不到文件。**  
**不要用 ZIP 接口验收「能下歌」。** 单曲听得见、出 WAV / mp4 → 走 §9 前端直连 CDN。

实测对照（同一首歌 `f9485f90-...` / 短链 `2UBl5AH4c7o6YXyT`）：

| 路径 | 结果 |
|---|---|
| 前端/本机：CDN `.mp4` → WAV | ✅ 成功（未调 `suno_api`） |
| `suno_api` ZIP | ❌ 见下方「ZIP 实测失败」 |

#### 能做（协议层）

| 能力 | 说明 |
|---|---|
| 健康检查 | `GET /health` → ok |
| 建下载任务 | `POST /api/download`（接受 `/song`、`/playlist`、`/@`）→ 返回 `jobId` |
| 查进度 | `GET /api/download/:jobId/status` |
| 下 ZIP / 分享 | 路由存在；**有文件时**才有意义 |

定位：设计上是服务端排队 → 拉歌 → 打 ZIP；**实现上对新 CDN 已脱节**。

#### 不能做 / 弱项

| 点 | 说明 |
|---|---|
| **当前经常下不到歌** | 任务可显示 `completed`，但 `progress.total = 0`，ZIP → `Failed to download file` |
| 不接受短链 | `suno.com/s/...` → `Invalid Suno URL`（须先解析成 `/song/<uuid>`） |
| 不返回 CDN 直链 | status 里没有 `audioUrl` / mp4 |
| 不出 WAV | 无格式选项；WAV 须前端自己转（§9） |
| **不提供媒体元数据** | 无 codec（AAC/Opus）、有无视频流、`attached_pic`、直链是否签名/过期（见 **§10**） |
| 音频源偏旧 | 源码按 `.mp3` 刮/拼；公开流常为 `.mp4` 且 `.mp3` 403 → 刮到 0 首仍标完成 |
| 与浏览器 WAV 无关 | 单曲 mp4→WAV **不用、也修不好** 这套 ZIP |

> **§10 的三项（codec / 视频流 / 签名）全部不能通过本接口获得**——须直拉 CDN 文件后用 `ffprobe`（或前端等价探测）。

#### ZIP 实测失败（2026-10-14，务必写进验收）

对正式页  
`https://suno.com/song/f9485f90-c0cd-4a20-85f6-4479e7efc262`：

| 步骤 | 结果 |
|---|---|
| health | ✅ ok |
| 短链建任务 | ❌ `Invalid Suno URL` |
| `/song/<uuid>` 建任务 | ✅ 有 `jobId` |
| status | ⚠️ `completed`，但 **`total: 0`**，有 `playlistName` / `shareCode` |
| 下 ZIP | ❌ `{"error":"Failed to download file"}` |
| share 信息 | `songCount: 0` |

结论：**接口没真正下到歌曲。** 根因是刮歌/拉 `.mp3` 空转，不是前端没调对。  
想让 ZIP 真能下：须改后端认 mp4 / 新 CDN，**只改前端调 ZIP 修不好。**

---

## 1. Base URL（选一个，前后端一致）

| 用途 | Base URL | 说明 |
|---|---|---|
| 推荐（独立 API 前缀） | `https://tsl.bosebrowser.com/suno_api` | 健康检查：`GET /health` → `{"status":"ok"}` |
| 也可（挂在页面同路径下） | `https://tsl.bosebrowser.com/suno` | 已反代到同一 Express |

业务接口路径统一为：`{BASE}/api/...`

> **注意：** 不要请求站点根路径 `https://tsl.bosebrowser.com/api/...`（会 403，被别的服务占用）。  
> 原版前端打包里若 `const so = ""`，就会踩这个坑；下载站请显式配置 base。

示例：

```ts
const API_BASE = "https://tsl.bosebrowser.com/suno_api";
// 或同域部署时：const API_BASE = "/suno_api";
```

---

## 2. 通用约定

- **协议：** HTTPS + JSON（下载 ZIP 时为二进制流）
- **鉴权：** 当前下载相关接口**无需**用户登录 / API Key（浏览器 Cookie 不参与）
- **CORS：** 已开启 `Access-Control-Allow-Credentials`；跨域时注意 Cookie 策略（本接口本身不依赖 Cookie）
- **错误体：** 多为 `{ "error": "字符串" }`，部分 500 带 `details`
- **任务模型：** 异步队列。先创建 job → 轮询 status → completed 后再下 ZIP

### 支持的 Suno URL

后端正则：

```text
^https?:\/\/(www\.)?suno\.com\/(playlist|song|@)
```

| 类型 | 示例 | 是否接受 |
|---|---|---|
| 单曲 | `https://suno.com/song/<uuid>` | ✅ |
| 歌单 | `https://suno.com/playlist/<uuid>` | ✅ |
| 用户主页 | `https://suno.com/@username` | ✅（按上游能力拉库） |
| 短链 | `https://suno.com/s/xxxx` | ❌ → `Invalid Suno URL` |
| 其它域名 | `https://example.com/...` | ❌ |

`www.` 前缀、query 参数（如 `?sh=`）一般可带。

---

## 3. 类型定义（TypeScript）

```ts
export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface DownloadOptions {
  /** 是否打包封面图；默认 false / 未传即可 */
  includeImages?: boolean;
}

export interface JobProgress {
  total: number;
  completed: number;
  failed: number;
  currentSong?: string;
}

export interface CreateJobResponse {
  jobId: string;
  status: JobStatus; // 创建时一般为 "queued"
  message: string;   // "Download job created"
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  progress: JobProgress;
  playlistName?: string;
  error?: string;
  /** 仅 status === "completed" 时返回 */
  shareCode?: string;
  expiresAt?: string; // ISO 时间
}

export interface ShareInfoResponse {
  jobId: string;
  playlistName?: string;
  songCount?: number;
  expiresAt: string;
  downloadCount: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
```

---

## 4. 接口列表

### 4.1 健康检查

```http
GET {BASE}/health
```

**响应 200**

```json
{
  "status": "ok",
  "timestamp": "2026-10-13T22:18:46.381Z"
}
```

> `{BASE}/` 根路径可能返回 500，以 `/health` 为准。

---

### 4.2 创建下载任务

```http
POST {BASE}/api/download
Content-Type: application/json
```

**请求体**

```json
{
  "url": "https://suno.com/song/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  "options": {
    "includeImages": false
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `url` | string | 是 | 合法 Suno 链接 |
| `options` | object | 否 | 可传 `{}` |
| `options.includeImages` | boolean | 否 | 是否包含图片 |

**成功 200**

```json
{
  "jobId": "2c73c09b-68ee-4663-9066-1e97d1e49a64",
  "status": "queued",
  "message": "Download job created"
}
```

**错误**

| HTTP | body | 场景 |
|---|---|---|
| 400 | `{"error":"URL is required"}` | 未传 url |
| 400 | `{"error":"Invalid Suno URL"}` | 链接格式不对 |
| 500 | `{"error":"Failed to create download job","details":"..."}` | 入队失败 |

**curl**

```bash
curl -X POST 'https://tsl.bosebrowser.com/suno_api/api/download' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://suno.com/song/<UUID>","options":{}}'
```

---

### 4.3 查询任务状态（轮询）

```http
GET {BASE}/api/download/:jobId/status
```

**建议：** 每 **1 秒** 轮询一次；`status` 为 `completed` 或 `failed` 时停止。

**进行中 / 失败示例**

```json
{
  "jobId": "65256308-fb0a-4e96-8dd6-bc3cd89911b2",
  "status": "failed",
  "progress": {
    "total": 0,
    "completed": 0,
    "failed": 0
  },
  "error": "HTTP 404: Not Found"
}
```

**成功完成时额外字段**

```json
{
  "jobId": "...",
  "status": "completed",
  "progress": {
    "total": 12,
    "completed": 12,
    "failed": 0
  },
  "playlistName": "My Playlist",
  "shareCode": "abc123",
  "expiresAt": "2026-10-20T12:00:00.000Z"
}
```

**进度条建议**

```ts
const percent =
  progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
```

| HTTP | body | 场景 |
|---|---|---|
| 200 | `JobStatusResponse` | 正常 |
| 404 | `{"error":"Job not found"}` | jobId 不存在 |
| 500 | `{"error":"Failed to get job status"}` | 服务异常 |

**状态机**

```text
queued → processing → completed
                   ↘ failed
```

常见 `error`（来自上游 Suno）：`HTTP 404: Not Found`、`HTTP 307: Temporary Redirect`（后者多与 Cookie/登录有关，属服务端配置问题）。

---

### 4.4 下载 ZIP（按 jobId）

```http
GET {BASE}/api/download/:jobId/download
```

- **仅** `status === "completed"` 时可下  
- 响应：`Content-Type: application/zip`  
- `Content-Disposition: attachment; filename="<playlistName|download>.zip"`

**前端用法（推荐直接跳转 / `<a href>`）**

```ts
const zipUrl = `${API_BASE}/api/download/${jobId}/download`;
window.location.href = zipUrl;
// 或 <a href={zipUrl}>Download ZIP</a>
```

| HTTP | body | 场景 |
|---|---|---|
| 200 | ZIP 二进制 | 成功 |
| 400 | `{"error":"Download not ready"}` | 未完成 |
| 404 | `{"error":"Job not found"}` / `Archive not found` | 无任务或文件丢了 |
| 500 | `{"error":"Failed to download file"}` | 读盘失败 |

---

### 4.5 分享链接信息

任务完成后 status 里会带 `shareCode`。前端可拼：

```text
{你的前端站点}/share/{shareCode}
```

查询分享元数据：

```http
GET {BASE}/api/share/:shareCode
```

**成功 200**

```json
{
  "jobId": "...",
  "playlistName": "My Playlist",
  "songCount": 12,
  "expiresAt": "2026-10-20T12:00:00.000Z",
  "downloadCount": 3
}
```

| HTTP | body |
|---|---|
| 404 | `{"error":"Link expired or invalid"}` / `Link not found` / `Download not found` |

---

### 4.6 通过分享码下载 ZIP

```http
GET {BASE}/api/share/:shareCode/download
```

行为同 4.4，成功会增加 `downloadCount`。过期或无效返回 404。

---

## 5. 推荐前端流程

```text
用户粘贴 Suno URL
        ↓
POST /api/download  → 拿到 jobId
        ↓
每 1s：GET /api/download/{jobId}/status
        ↓
   ┌─ failed  → 展示 error
   └─ completed → 展示 Download ZIP
                    可选：复制 /share/{shareCode}
        ↓
GET /api/download/{jobId}/download  （浏览器直接下载）
```

### 最小调用示例

```ts
const API_BASE = "https://tsl.bosebrowser.com/suno_api";

async function downloadSuno(url: string) {
  const create = await fetch(`${API_BASE}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, options: {} }),
  }).then((r) => r.json());

  if (!create.jobId) throw new Error(create.error || "create failed");

  for (;;) {
    await new Promise((r) => setTimeout(r, 1000));
    const status = await fetch(
      `${API_BASE}/api/download/${create.jobId}/status`,
    ).then((r) => r.json());

    if (status.status === "failed") {
      throw new Error(status.error || "download failed");
    }
    if (status.status === "completed") {
      window.location.href = `${API_BASE}/api/download/${create.jobId}/download`;
      return status; // 含 shareCode / expiresAt
    }
  }
}
```

---

## 6. 开发下载站时的配置清单

1. **API Base 写死或环境变量：** `/suno_api` 或完整 `https://tsl.bosebrowser.com/suno_api`
2. **不要**用空字符串当 base（会打到错误的根 `/api`）
3. **ZIP 批量：** 校验 URL 时可与后端正则对齐；短链 `/s/` 需先解析成 `/song/<uuid>` 再调后端
4. **单曲 WAV：** 走 §9，短链可直接在前端处理，不必先改后端正则
5. ZIP 用浏览器原生下载，不要用 `fetch` 再手动拼 Blob（大文件更省事）
6. 真链若长期 `307` / 鉴权失败：查**服务端** Suno Cookie / Redis，不是前端接口路径问题
7. **不要**在服务器用 ffmpeg 出 WAV（体积大、占带宽）；优先浏览器转码，与「不落库不中转」一致

---

## 7. 快速自检（ZIP 接口）

```bash
BASE=https://tsl.bosebrowser.com/suno_api
# 短链须先换成正式页，例如：
SONG=https://suno.com/song/f9485f90-c0cd-4a20-85f6-4479e7efc262

curl -s "$BASE/health"

# 短链应失败（预期）
curl -s -X POST "$BASE/api/download" \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://suno.com/s/2UBl5AH4c7o6YXyT"}'

# 建任务 → 记下 jobId
curl -s -X POST "$BASE/api/download" \
  -H 'Content-Type: application/json' \
  -d "{\"url\":\"$SONG\",\"options\":{}}"

curl -s "$BASE/api/download/JOB_ID/status"

curl -L -o out.zip "$BASE/api/download/JOB_ID/download"
file out.zip; ls -la out.zip
```

**成功标准（缺一不可）：**

1. `status === "completed"`
2. **`progress.total > 0`**（且 `completed` 接近 total）
3. `out.zip` 是真 ZIP（`file` 显示 Zip archive），不是 JSON 错误体

> 仅看到 `completed` **不够**。线上已出现 `completed` + `total: 0` + ZIP `Failed to download file`——**等于没下到歌**。  
> 单曲出音频请改测 §9（直拉 mp4），不要用 ZIP 结果当「能下歌」。

---


## 8. 接口一览表

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| POST | `/api/download` | 创建任务 |
| GET | `/api/download/:jobId/status` | 查进度 |
| GET | `/api/download/:jobId/download` | 下 ZIP |
| GET | `/api/share/:shareCode` | 分享信息 |
| GET | `/api/share/:shareCode/download` | 分享下载 ZIP |

---

## 9. 浏览器端 WAV 方案（不改后端）

> 情报与实测对齐：[sunoaidownload.com/suno-to-wav](https://sunoaidownload.com/suno-to-wav) 文案「Paste a Suno share link and your browser turns the track into an uncompressed WAV file」——**MP3/MP4 在浏览器解码 → 写 WAV 头**，服务器零转码、零存 WAV。  
> 你们现有 ZIP 接口**不返回 CDN 直链**；做单曲 WAV **不要指望只调 `/api/download`**，前端自己解析媒体 URL 即可，**后端可不动**。

### 9.1 方案对比

| 方案 | 成本 | 适合 |
|---|---|---|
| **浏览器内转**（Web Audio `decodeAudioData` / 必要时 ffmpeg.wasm） | 服务器零带宽、零排队 | ✅ **首选**；和「不落库不中转」一致 |
| 服务器 ffmpeg | WAV 体积约为有损源的 **4.4～11 倍**（例：4 分钟 44.1kHz/16bit 立体声 ≈ 42MB；320kbps mp3 ≈ 9.6MB → ~4.4×；128kbps → ~11×） | 仅当 CDN 跨域 `fetch` 实在过不去时再上 |

**先实测 CDN 能否在浏览器 `fetch` 到字节，再决定要不要代理；别先建代理。**

### 9.2 CDN 现实（2026-10 实测）

不要默认 `https://cdn1.suno.ai/<id>.mp3` 一定能下。

| 形态 | 实测 | 说明 |
|---|---|---|
| `cdn1.suno.ai/<uuid>.mp3` | 多首 **403** | 经典拼法经常失效 |
| `cdn1.suno.ai/<uuid>.mp4` | **200** + `Access-Control-Allow-Origin: *` | 当前公开流常见可用源 |
| CloudFront `.../clip/<uuid>.m4a` | 有时 200 + CORS `*`，内容可能加密 | 勿当普通音频硬解 |
| 封面 | `cdn2.suno.ai/image_<uuid>.jpeg` 等 | 可选 |

**产品表述建议：**

- ❌ 「mp3 一定能下；mp4 用来转 wav」  
- ✅ 「解析出**可用直链**（现在经常是 **mp4**）→ 可存原文件 / 浏览器转 **WAV**（音质不会高于公开流，不是 Pro 母带）」

示例短链实测：[https://suno.com/s/2UBl5AH4c7o6YXyT](https://suno.com/s/2UBl5AH4c7o6YXyT)

| 项 | 值 |
|---|---|
| 正式页 | `https://suno.com/song/f9485f90-c0cd-4a20-85f6-4479e7efc262` |
| `.mp3` | 403 |
| `.mp4` | 200，约 14MB，CORS `*` |
| mp4→WAV | 成功（约 6′27″，16-bit / 48kHz 立体声，约 71MB） |

### 9.3 前端流程（推荐）

```text
用户粘贴 Suno 链接（支持 /song/<uuid> 或 /s/短链）
        ↓
解析出 uuid + 可用 mediaUrl（优先探测 .mp4，勿死拼 .mp3）
        ↓
浏览器 fetch(mediaUrl)  →  ArrayBuffer   （校验 CORS，期望 ACAO: *）
        ↓
AudioContext.decodeAudioData(...)
        ↓
PCM → 拼 RIFF/WAV 头 → Blob(type: "audio/wav")
        ↓
<a download> 触发本机保存
```

可选：同一 `mediaUrl` 再提供「下载原文件（mp4）」按钮。

### 9.4 如何拿到 mediaUrl（前端完成，不调 ZIP API）

1. **短链** `suno.com/s/xxxx`：先打开/跟随到 `suno.com/song/<uuid>`（或用解析服务）。  
2. **歌曲页 HTML**：读嵌入 JSON / meta 里的媒体字段；常见有  
   - `https://cdn1.suno.ai/<uuid>.mp4`  
   - （旧）`og:audio` → `.mp3`（很多已无）  
3. **拼 URL 后探测：** 对 `.mp4` / `.mp3` 发 `HEAD` 或小范围 `GET`，用 **200** 的那条。  
4. **第三方解析（可选）：** 如 OpenSuno `track?url=`、同行 `POST /api/sniff`——注意它们常仍拼出 `.mp3`，**要以实际 HTTP 状态为准**，失败则改试 `.mp4`。

`<id>` = 歌曲 UUID（来自 `/song/<uuid>` 路径）。

### 9.5 转码要点（与同行一致）

```ts
// 伪代码：fetch → decode → wav Blob
const res = await fetch(mediaUrl); // CDN，期望 ACAO *
if (!res.ok) throw new Error(`media ${res.status}`);
const buf = await res.arrayBuffer();

const ctx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffer = await ctx.decodeAudioData(buf.slice(0));
ctx.close();

// 将 audioBuffer 各声道 PCM 写成 16-bit LE，加 44 字节 RIFF/WAVE 头
const wavBlob = audioBufferToWavBlob(audioBuffer); // type: "audio/wav"
// createObjectURL + <a download="title.wav">
```

- WAV = **无损容器 + 有损源的解包**，不能恢复比公开流更多的细节。  
- 大文件（数分钟歌 WAV 可达几十 MB）在主线程可能卡顿，可考虑 Worker / 分段提示。  
- 仅当 `fetch` 因 CORS 失败时，再考虑极薄的媒体代理或服务器 ffmpeg（非首选）。

### 9.6 和现有 ZIP API 的边界

| | ZIP 后端（§4） | 浏览器 WAV（§9） |
|---|---|---|
| 输入 | `/song` `/playlist` `/@`（不接受短链） | 短链 + 单曲页均可 |
| 输出 | 服务端打好的 ZIP（内多为 `.mp3` 逻辑） | 本机 `.wav` / 可选原 `.mp4` |
| 后端改动 | 无 | **无** |
| 风险 | 上游仍按 `.mp3` 拉时，新歌可能大面积失败 | 依赖 CDN 形态；以探测到的可用 URL 为准 |

下载站建议：

- **单曲 WAV / 原文件：走 §9**（已验证能出）  
- **ZIP 批量：§4 协议可对接，但当前线上经常下不到歌**——产品上先别承诺；要修好须后端认 mp4 / 新 CDN，与 §9 前端解耦排期
- **按钮文案 / 是否提供 Video：按 §10 对 CDN 文件实测**，不要问 `suno_api`

---

## 10. 媒体三问实测（codec / 视频流 / 签名）— 接口给不了

改文案前必须自测的三项。样本：  
`https://cdn1.suno.ai/f9485f90-c0cd-4a20-85f6-4479e7efc262.mp4`  
（短链 `https://suno.com/s/2UBl5AH4c7o6YXyT`）

### 10.1 通过我们接口能获得这些吗？

| 你要的 | `suno_api` 有没有 |
|---|---|
| CDN 直链（mp4/mp3） | ❌ |
| codec（AAC / Opus） | ❌ |
| 有无视频流 / `attached_pic` | ❌ |
| 签名 / 过期信息 | ❌ |
| 可用音视频文件 | ❌（常 `total=0`） |

接口实际只给：`jobId`、`status`、`progress`、`playlistName`、`shareCode`、`expiresAt`（分享过期），以及（理论上）ZIP。  
**§10 结论全部来自直拉 CDN + `ffprobe`，未经过 `suno_api`。**

探测命令示例：

```bash
ffprobe -v error \
  -show_entries stream=codec_name,codec_type,sample_rate,bit_rate,nb_frames,width,height \
  -show_entries format=format_name,duration,bit_rate \
  -of default=noprint_wrappers=1 你的文件.mp4

# 看 disposition / attached_pic：
ffprobe -v error -show_streams -of json 你的文件.mp4
```

### 10.2 Codec：Opus 还是 AAC？

| 来源 | 结果 |
|---|---|
| **可下载的 `cdn1` `.mp4`** | 音轨 **aac** (LC)，48kHz / stereo / ~194 kbps；视频 **h264** |
| 歌曲页 JSON 自述 | 另有 `content_type: "m4a-opus"` 的 CloudFront `.m4a` |
| 该 `.m4a` 实测 | HTTP 200，但 **解不开**（非标准/疑似加密），**不能当 Opus 交付物** |

→ 按钮命名：对 CDN 交付物，**别写死 M4A / Opus**；最稳是 **Original (as delivered)**。  
若写技术细节，这份实测是 **MP4 = H.264 + AAC**（不是 Opus）。chunks 自称 Opus ≠ 这份公开 mp4。

### 10.3 有没有视频流 / 封面 attached_pic？

| 检查 | 结果 |
|---|---|
| `attached_pic` | **无** |
| video track | **有**：h264，824×1464，10fps，约 3872 帧，时长 ≈ 387s |
| 画面 | 竖屏歌词卡（不同时间点歌词在变），码率偏低但是**真 video 流** |

→ 这首 **可以** 提供 Video / 做 `/video/` 页——用户拿到的是能播的竖屏视频。  
→ **没有** video track 的文件：千万别在下载选项里写「MP4 视频」，否则用户以为能下视频、实际只有音频，留存会被打穿。须按文件探测，不能全局写死。

### 10.4 直链带不带签名、多久过期？

| 检查 | `cdn1.suno.ai/<uuid>.mp4` |
|---|---|
| URL 形态 | **路径型**，无 `?Signature=` / `Expires=` |
| 再拉 | 仍 200（CloudFront 可 Hit） |
| 短时效签名 | **当前未见** |
| 另：CloudFront `.m4a` | 有 `x-amz-expiration`（S3 **对象生命周期**删文件，不是 URL 签名过期）；且该文件解不开，勿当下载源 |

→ 对这类 path-only mp4：可缓存 `uuid` 再拼，不必当短签逐次解析。  
→ 架构仍建议「跟随解析出的实际 URL」，别写死后缀永远是 `.mp3`（ZIP 已踩坑）。Suno 若改成短签，须改为实时解析、禁止长期缓存直链。

### 10.5 对下载站文案的直接含义

1. **Original** → `Original (as delivered)`；本样本技术上是 AAC-in-MP4。  
2. **Video** → 本样本 **可以提供**（有真画面）；其他歌须先探测再决定是否显示。  
3. **签名** → 公开 `cdn1` mp4 **目前不像短签**；页面 `m4a-opus` 播放流别当下载源。  
4. 以上 **都不要指望从 `suno_api` 读字段**——前端/Worker 拿 CDN 文件后自测。

---

文档版本：按 2026-10-14 线上 `tsl.bosebrowser.com` 实测 + 上游 `master` 源码核对。  
文首与 §7：**ZIP completed 但 total=0 = 没下到歌**；§9 mp4→WAV 成功且未走 ZIP；**§10 媒体三问 + 接口无法提供这些元数据**（样本短链 `2UBl5AH4c7o6YXyT`）。

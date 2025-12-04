# Frontend Quick Start Guide

## 🎯 目标
启动React前端，连接后端API，可视化Warwick CS论文数据

## ✅ 前提条件检查

在开始前，确保：
- [x] Node.js 16+ 已安装 (`node --version`)
- [x] npm 已安装 (`npm --version`)
- [x] 后端API正在运行 (http://localhost:5000)

## 🚀 3步启动

### 步骤1: 安装依赖
```bash
cd frontend
npm install
```

这会安装：
- React 18.2
- D3.js 7.8
- Axios 1.6
- React Scripts 5.0

预计时间：1-3分钟

### 步骤2: 启动开发服务器
```bash
npm start
```

你会看到：
```
Compiled successfully!

You can now view warwick-paper-visualization in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

浏览器会自动打开 http://localhost:3000

### 步骤3: 验证功能

**必须测试的功能：**

1. **Dashboard (仪表板)**
   - [ ] Timeline显示
   - [ ] 统计卡片显示数据
   - [ ] Top 5论文列表
   - [ ] 点击年份筛选

2. **Citation Network (引用网络)**
   - [ ] 网络图加载
   - [ ] 节点可以拖动
   - [ ] 鼠标滚轮缩放
   - [ ] 悬停显示信息
   - [ ] 点击节点打开DOI
   - [ ] 过滤器工作

3. **Collaboration Network (合作网络)**
   - [ ] 网络图加载
   - [ ] 节点可拖动
   - [ ] 连线粗细不同
   - [ ] 过滤器工作

## 🎨 界面预览

启动后你会看到：

```
┌─────────────────────────────────────────┐
│  🎓 Warwick CS Paper Visualization      │
│  Interactive visualization of papers    │
├─────────────────────────────────────────┤
│ [📊 Dashboard] [🔗 Citation] [👥 Collab]│
├─────────────────────────────────────────┤
│                                         │
│  [Timeline Chart]                       │
│  ████ ████ █████ ████ ███              │
│  2020 2021 2022 2023 2024              │
│                                         │
│  [Statistics Cards]                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │ 500 │ │ 12.5│ │ 4.2 │ │2020-│     │
│  │Paper│ │Cites│ │Team │ │2024 │     │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
│                                         │
│  [Top 5 Papers]                         │
│  1. ⭐⭐⭐ 45 citations                 │
│  2. ⭐⭐⭐ 38 citations                 │
│  ...                                    │
└─────────────────────────────────────────┘
```

## 🔍 测试API连接

### 方法1: 检查浏览器控制台
按 F12 打开开发者工具，应该没有红色错误。

### 方法2: 检查Network标签
在Network标签中，应该看到：
- ✅ GET /api/timeline (200 OK)
- ✅ GET /api/stats (200 OK)
- ✅ GET /api/networks/citation (200 OK)

### 方法3: 使用浏览器直接访问API
在新标签页打开：
- http://localhost:5000/api/health

应该看到JSON响应：
```json
{
  "status": "healthy",
  "data_loaded": true
}
```

## 🐛 常见问题

### 问题1: "npm: command not found"
**解决**:
```bash
# macOS
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Windows
# 下载安装包: https://nodejs.org
```

### 问题2: "Failed to fetch"
**原因**: 无法连接后端

**解决**:
```bash
# 1. 检查后端是否运行
curl http://localhost:5000/api/health

# 2. 如果没运行，启动后端
cd ../backend
python app.py

# 3. 检查防火墙设置
```

### 问题3: "Port 3000 already in use"
**解决**:
```bash
# 方法1: 使用其他端口
PORT=3001 npm start

# 方法2: 杀掉占用端口的进程
lsof -i :3000
kill -9 <PID>
```

### 问题4: 空白页面
**解决**:
```bash
# 1. 检查浏览器控制台错误
# 2. 清除缓存
# 3. 重启开发服务器
npm start

# 4. 检查后端API
curl http://localhost:5000/api/health
```

### 问题5: 网络图不显示
**可能原因**:
- 数据为空
- 后端API错误
- D3.js加载失败

**解决**:
```bash
# 检查后端数据
curl "http://localhost:5000/api/networks/citation?limit=10"

# 查看浏览器控制台错误
# F12 > Console
```

## 📊 功能演示清单

完成以下操作以验证所有功能：

### Dashboard
1. [ ] 打开 Dashboard 标签
2. [ ] 观察Timeline柱状图
3. [ ] 点击某个年份的柱子
4. [ ] 确认统计数据更新
5. [ ] 点击"Clear Filter"
6. [ ] 确认回到总体统计

### Citation Network
1. [ ] 切换到 Citation Network 标签
2. [ ] 等待网络图加载
3. [ ] 拖动一个节点
4. [ ] 使用鼠标滚轮缩放
5. [ ] 悬停在节点上查看信息
6. [ ] 点击一个有DOI的节点
7. [ ] 确认新标签页打开DOI链接
8. [ ] 调整"Max Papers"滑块
9. [ ] 点击"Apply Filters"
10. [ ] 观察节点数量变化

### Collaboration Network
1. [ ] 切换到 Collaboration Network 标签
2. [ ] 等待网络图加载
3. [ ] 拖动节点
4. [ ] 观察不同粗细的连线
5. [ ] 调整"Min Collaborations"
6. [ ] 应用过滤器
7. [ ] 观察变化

## ⏱️ 预计时间

- 安装依赖: 1-3分钟
- 首次启动: 30秒-1分钟
- 测试所有功能: 5-10分钟
- **总计**: 约10-15分钟

## ✅ 成功标志

你已成功完成前端设置，如果：
- ✅ 所有三个标签页都能正常切换
- ✅ Dashboard显示统计数据
- ✅ Timeline可以点击并筛选
- ✅ Citation Network显示网络图且节点可拖动
- ✅ Collaboration Network显示网络图
- ✅ 浏览器控制台无错误
- ✅ Network标签显示成功的API请求

## 🎥 下一步：录制演示视频

前端测试成功后，录制演示视频：

### 录制内容
1. **Dashboard演示** (1分钟)
   - 展示整体界面
   - 点击Timeline并观察筛选

2. **Citation Network演示** (2分钟)
   - 展示网络图
   - 拖动节点
   - 缩放和平移
   - 点击节点打开DOI
   - 使用过滤器

3. **Collaboration Network演示** (1分钟)
   - 展示作者网络
   - 演示交互

4. **技术说明** (1分钟)
   - 简述技术栈
   - 说明数据来源
   - 解释优化方法

### 录制工具推荐
- **macOS**: QuickTime Player (Cmd+Shift+5)
- **Windows**: Xbox Game Bar (Win+G)
- **跨平台**: OBS Studio (免费)
- **在线**: Loom

### 录制技巧
- 使用1080p分辨率
- 放慢演示速度
- 用文字标注关键点
- 添加旁白解释

## 📝 提交清单

提交前检查：
- [ ] 前端代码已提交到GitHub
- [ ] 后端代码已提交到GitHub
- [ ] README.md包含完整说明
- [ ] 演示视频已录制
- [ ] 所有功能正常工作
- [ ] 代码有适当注释

## 🎉 恭喜！

如果所有功能都正常工作，你已经完成了：
- ✅ Phase 1: 数据预处理
- ✅ Phase 2: 后端API
- ✅ Phase 3: 前端可视化

只剩下 Phase 4: 测试和部署！

---

**需要帮助？**
- 查看 `README.md` 获取详细文档
- 检查浏览器控制台的错误信息
- 确认后端API正在运行并返回数据

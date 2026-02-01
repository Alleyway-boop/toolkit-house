# React Demo

React 19 演示应用，展示 Toolkit House 包和组件。

## 功能

### Health Check

基本的 GraphQL 查询演示。

### Users List

从 API 获取并显示用户列表。

### Create Post Form

使用 mutation 的表单演示。

### Posts Feed

数据获取和订阅演示。

### Login

认证演示。

### RequestPool Demo

ts-utils RequestPool 演示。

## 安装

```bash
cd apps/react-demo
pnpm install
```

## 开发

```bash
pnpm run dev
# http://localhost:5173
```

## 构建

```bash
pnpm run build
pnpm run preview
```

## 环境

```bash
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

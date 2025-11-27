#!/bin/bash

# 更新所有子模块到最新提交
echo "Updating all submodules to latest commits..."

# 更新每个子模块到其跟踪分支的最新提交
git submodule update --init --remote --merge

# 检查是否有更新
if ! git diff --quiet --exit-code; then
    echo "Submodules updated, committing changes..."
    git add .
    git commit -m "chore: update submodules to latest commits

$(git submodule foreach 'echo "- $(basename $path): $(git log -1 --oneline)"')"
    echo "Submodule updates committed"
else
    echo "No submodule updates available"
fi
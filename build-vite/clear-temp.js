import fs from 'fs';

// 获取当前进程的工作目录
const cwd = process.cwd();

// 构建根目录下的文件路径
const rootPath = `${cwd}/`;

// 获取根目录下的文件列表
fs.readdir(rootPath, (err, files) => {
  if (err) {
    console.error('读取目录时发生错误:', err);
    return;
  }

  // 遍历文件列表
  files.forEach(file => {
    // 构建完整的文件路径
    const filePath = `${rootPath}${file}`;
    // 检查文件是否以.html结尾
    if (file.endsWith('.html')) {
      // 删除文件
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`删除文件 ${filePath} 时发生错误:`, err);
        } else {
          console.log(`文件 ${filePath} 已删除。`);
        }
      });
    }
  });
});

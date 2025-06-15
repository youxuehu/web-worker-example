// 定义与 Worker 通信的消息类型
interface WorkerRequest {
    type: 'CALCULATE_SUM';
    data: number;
}

interface WorkerResponse {
    type: 'RESULT' | 'PROGRESS' | 'ERROR';
    result?: number;
    progress?: number;
    message?: string;
}

const resultElement = document.getElementById('result')!;
const statusElement = document.getElementById('status')!;
const calculateButton = document.getElementById('calculate')!;
const terminateButton = document.getElementById('terminate')!;

// 创建 Worker - 使用相对路径
// 在 main.ts 中
const worker = new Worker('../dist/worker.js');

// 处理来自 Worker 的消息
worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const response = e.data;
    
    switch (response.type) {
        case 'RESULT':
            resultElement.innerHTML = `计算结果: <strong>${response.result}</strong>`;
            statusElement.textContent = '计算完成！';
            break;
            
        case 'PROGRESS':
            statusElement.textContent = `计算中... ${response.progress}%`;
            break;
            
        case 'ERROR':
            resultElement.innerHTML = `<span style="color:red">错误: ${response.message}</span>`;
            statusElement.textContent = '';
            break;
    }
};

// 错误处理
worker.onerror = (e: ErrorEvent) => {
    resultElement.innerHTML = `<span style="color:red">Worker 错误: ${e.message}</span>`;
    statusElement.textContent = '';
};

// 按钮事件
calculateButton.addEventListener('click', () => {
    resultElement.innerHTML = '';
    statusElement.textContent = '开始计算...';
    
    const request: WorkerRequest = {
        type: 'CALCULATE_SUM',
        data: 10_000_000  // 计算1到1000万的和
    };
    
    worker.postMessage(request);
});

terminateButton.addEventListener('click', () => {
    worker.terminate();
    statusElement.textContent = 'Worker 已终止';
});
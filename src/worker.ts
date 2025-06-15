// 定义与主线程通信的消息类型
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

// 监听主线程消息
self.onmessage = (e: MessageEvent<WorkerRequest>) => {
    const request = e.data;
    
    if (request.type === 'CALCULATE_SUM') {
        const maxNumber = request.data;
        let sum = 0;
        
        try {
            // 模拟耗时计算 (1到maxNumber的求和)
            for (let i = 1; i <= maxNumber; i++) {
                sum += i;
                
                // 每1%进度报告一次
                if (i % (maxNumber / 100) === 0) {
                    const progress = Math.round((i / maxNumber) * 100);
                    const response: WorkerResponse = {
                        type: 'PROGRESS',
                        progress: progress
                    };
                    self.postMessage(response);
                }
            }
            
            // 发送最终结果
            const response: WorkerResponse = {
                type: 'RESULT',
                result: sum
            };
            self.postMessage(response);
            
        } catch (error) {
            const response: WorkerResponse = {
                type: 'ERROR',
                message: error instanceof Error ? error.message : '未知错误'
            };
            self.postMessage(response);
        }
    }
};

// 导出空对象以满足 TypeScript 模块要求
// export default {};
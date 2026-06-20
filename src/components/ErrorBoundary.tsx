import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// 全局错误边界：防止存档损坏或渲染异常导致白屏
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('应用崩溃:', error, info);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('idle-empire-save');
    } catch {
      // 忽略
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ancient-900 text-ancient-100 p-4">
          <div className="game-panel max-w-md text-center space-y-4">
            <div className="text-5xl">💀</div>
            <h1 className="text-2xl font-display text-war-300">帝国崩溃</h1>
            <p className="text-sm text-ancient-400">
              游戏遇到了严重错误，可能是存档损坏导致。
            </p>
            {this.state.error && (
              <pre className="text-xs text-war-400 bg-ancient-900/50 p-2 rounded text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <button className="game-button" onClick={this.handleReload}>
                重新加载
              </button>
              <button className="game-button game-button-danger" onClick={this.handleReset}>
                清除存档并重启
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

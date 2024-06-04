pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    // 使用 retry 和 timeout 包裹 Git 命令
                    retry(3) {  // 如果命令失败，最多重试3次
                        timeout(time: 5, unit: 'MINUTES') {  // 单次尝试最大持续5分钟
                            git branch: 'master',
                                url: 'https://github.com/HyxiaoGe/xiaohub.git',
                                credentialsId: 'login_credentials'
                        }
                    }
                }
            }
        }
        stage('Prepare environment') {
            steps {
                script {
                    echo 'prepare necessary environment...'
                    // 创建.env 文件，注意使用双引号
                    writeFile file: '.env', text: """
                    VITE_APP_END_POINT=${env.END_POINT}
                    """
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Installing NPM dependencies...'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm run build'
            }
        }
        stage('Deployment') {
            steps {
                echo 'Deploying to Nginx directory...'
                sh 'rm -rf /docker/nginx/data/html/xiaohub/*'  // 清理旧文件
                sh 'cp -r dist/* /docker/nginx/data/html/xiaohub/'  // 复制新文件
                sh 'sudo docker restart nginx'  // 重载 Nginx
            }
        }
    }
    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
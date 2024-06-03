pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    // 定义超时时间（分钟）
                    def checkoutTimeout = 20
                    // 设置 Git 检出步骤
                    git branch: 'master',
                        url: 'https://github.com/HyxiaoGe/xiaohub.git',
                        credentialsId: 'login_credentials',
                        timeout: checkoutTimeout
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
            }
        }
    }
}

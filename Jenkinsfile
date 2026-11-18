
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'oredollar/clock-app'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out clock application source code...'
                checkout scm
            }
        }

        stage('Validate Files') {
            steps {
                echo 'Checking application files...'

                sh '''
                    set -eux

                    pwd
                    ls -la

                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile

                    echo "All required files exist!"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'

                sh '''
                    docker build \
                    -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                    -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing image to Docker Hub...'

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    sh '''
                        set -eu

                        echo "$DOCKER_TOKEN" | docker login \
                        --username "$DOCKER_USER" \
                        --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Clock application built and pushed!'
        }

        failure {
            echo 'FAILED: Check the Jenkins console output.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
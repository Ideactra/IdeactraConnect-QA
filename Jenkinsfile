pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['login', 'hire'],
            description: 'Select the Playwright test suite'
        )
    }

    environment {
        EMAIL = credentials('IDEACTRA_EMAIL')
        PASSWORD = credentials('IDEACTRA_PASSWORD')
        CI = "true"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps'
                    } else {
                        bat 'npx playwright install chromium'
                    }
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh "npx playwright test tests/${params.TEST_SUITE}.spec.js"
                    } else {
                        bat "npx playwright test tests/${params.TEST_SUITE}.spec.js"
                    }
                }
            }
        }

        stage('Publish HTML Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }

    post {
        always {
            junit testResults: 'test-results/results.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            archiveArtifacts artifacts: 'test-results/**', fingerprint: true
        }

        success {
            echo 'Playwright tests executed successfully.'
        }

        failure {
            echo 'Playwright tests failed.'
        }
    }
}

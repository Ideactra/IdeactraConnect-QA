pipeline {
    agent any

    // Remove this block if the NodeJS plugin is NOT installed/configured
    tools {
        nodejs 'NodeJS'
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['login', 'hire'],
            description: 'Select the Playwright test suite to run'
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

        stage('Check Node & NPM Version') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'node -v'
                        sh 'npm -v'
                    } else {
                        bat 'node -v'
                        bat 'npm -v'
                    }
                }
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

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
                archiveArtifacts artifacts: 'test-results/**', fingerprint: true
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'

            archiveArtifacts allowEmptyArchive: true,
                artifacts: 'playwright-report/**'

            archiveArtifacts allowEmptyArchive: true,
                artifacts: 'test-results/**'
        }

        success {
            echo ' Playwright tests completed successfully.'
        }

        failure {
            echo ' Playwright tests failed.'
        }
    }
}
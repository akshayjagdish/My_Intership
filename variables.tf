variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "environment" {
  type    = string
  default = "production"
}
variable "service_name" {
  type    = string
  default = "launchpad"
}
variable "container_image" {
  type        = string
  description = "Immutable image URI, ideally pinned by digest"
}
variable "database_url_secret_arn" {
  type        = string
  description = "Secrets Manager ARN containing DATABASE_URL"
}
variable "certificate_arn" {
  type        = string
  description = "ACM certificate ARN in the deployment region"
}

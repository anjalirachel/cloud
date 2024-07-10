provider "google" {
  credentials = file("cloud-assignments-428917-bdcc7d4ea8f1.json")
  project     = "cloud-assignments-428917"
  region      = "us-central1"
}

resource "google_container_cluster" "k8-assignment-cluster-1" {
  name              = "k8-assignment-cluster-1"
  project           = "cloud-assignments-428917"
  location          = "us-central1"
  initial_node_count = 1

  # Node pool configurations
  node_config {
    machine_type = "e2-small"
    disk_size_gb = 20
    image_type   = "COS_CONTAINERD"
    disk_type    = "pd-standard"
  }
}

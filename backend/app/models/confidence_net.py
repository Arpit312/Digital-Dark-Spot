import math
from typing import List, Tuple, Dict, Any
import torch
import torch.nn as nn

class FindingConfidenceNet(nn.Module):
    """
    F10 PyTorch Neural Network:
    Architecture: 8 -> 16 -> 8 -> 1 with ReLU, Dropout(0.2), and Sigmoid.
    Input features x: [P_ent, P_con, T, F, sim, v, w_a, G_a]
    """
    def __init__(self):
        super(FindingConfidenceNet, self).__init__()
        self.fc1 = nn.Linear(8, 16)
        self.relu1 = nn.ReLU()
        self.dropout1 = nn.Dropout(0.2)
        
        self.fc2 = nn.Linear(16, 8)
        self.relu2 = nn.ReLU()
        
        self.fc3 = nn.Linear(8, 1)
        self.sigmoid = nn.Sigmoid()

        self._init_weights()

    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                nn.init.zeros_(m.bias)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = self.fc1(x)
        out = self.relu1(out)
        out = self.dropout1(out)
        out = self.fc2(out)
        out = self.relu2(out)
        out = self.fc3(out)
        out = self.sigmoid(out)
        return out

def compute_ece(
    confidences: List[float],
    ground_truth: List[int],
    num_bins: int = 10
) -> float:
    """
    Expected Calibration Error (ECE) Formula:
    ECE = Σ_m (|B_m| / n) * | acc(B_m) - conf(B_m) |
    """
    if not confidences or len(confidences) != len(ground_truth):
        return 0.0

    n = len(confidences)
    bin_size = 1.0 / num_bins
    ece = 0.0

    for i in range(num_bins):
        bin_lower = i * bin_size
        bin_upper = (i + 1) * bin_size

        # Find items in bin B_m
        bin_indices = [
            idx for idx, conf in enumerate(confidences)
            if (bin_lower <= conf < bin_upper) or (i == num_bins - 1 and conf == bin_upper)
        ]

        if not bin_indices:
            continue

        bin_len = len(bin_indices)
        bin_conf = sum(confidences[idx] for idx in bin_indices) / bin_len
        bin_acc = sum(ground_truth[idx] for idx in bin_indices) / bin_len

        ece += (bin_len / n) * abs(bin_acc - bin_conf)

    return round(float(ece), 4)

def compute_conformal_threshold(
    calibration_scores: List[float],
    alpha: float = 0.1
) -> float:
    """
    Conformal Abstention Threshold Formula:
    q = quantile at ceil((n+1)(1-alpha)) / n of nonconformity scores s_i
    """
    if not calibration_scores:
        return 0.5

    n = len(calibration_scores)
    sorted_scores = sorted(calibration_scores)
    rank = min(n, math.ceil((n + 1) * (1.0 - alpha)))
    q_threshold = sorted_scores[rank - 1]
    return round(float(q_threshold), 4)

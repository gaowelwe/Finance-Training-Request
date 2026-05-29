let currentStep = 1;
const totalSteps = 4;
const formData = {};

document.addEventListener('DOMContentLoaded', function () {
    updateStepIndicator();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', prevStep);
    document.getElementById('trainingForm').addEventListener('submit', handleSubmit);
}

function updateStepIndicator() {
    const indicator = document.getElementById('stepIndicator');
    indicator.innerHTML = '';

    const steps = ['Employee', 'Training', 'Motivation', 'Review'];

    for (let i = 1; i <= totalSteps; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        if (i < currentStep) stepDiv.classList.add('completed');
        if (i === currentStep) stepDiv.classList.add('active');

        stepDiv.innerHTML = `
            <div class="step-number">${i < currentStep ? '✓' : i}</div>
            <div class="step-label">${steps[i - 1]}</div>
        `;

        indicator.appendChild(stepDiv);
    }
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });

    document.querySelector(`[data-step="${step}"]`).classList.add('active');

    document.getElementById('prevBtn').style.display = step === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = step === totalSteps ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = step === totalSteps ? 'block' : 'none';

    if (step === totalSteps) {
        showReviewSummary();
    }
}

function nextStep() {
    if (validateStep(currentStep)) {
        collectFormData();
        currentStep++;
        showStep(currentStep);
        updateStepIndicator();
    }
}

function prevStep() {
    currentStep--;
    showStep(currentStep);
    updateStepIndicator();
}

function validateStep(step) {
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');

    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#d1d5db';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
    }

    return isValid;
}

function collectFormData() {
    const form = document.getElementById('trainingForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else {
            formData[input.name] = input.value;
        }
    });
}

function showReviewSummary() {
    const summary = document.getElementById('reviewSummary');
    summary.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Request Summary</h3>
        <div class="review-item">
            <div class="review-label">Employee</div>
            <div>${formData.fullName} (${formData.employeeNumber})</div>
        </div>
        <div class="review-item">
            <div class="review-label">Department</div>
            <div>${formData.department}</div>
        </div>
        <div class="review-item">
            <div class="review-label">Training</div>
            <div>${formData.trainingTitle}</div>
        </div>
        <div class="review-item">
            <div class="review-label">Provider</div>
            <div>${formData.serviceProvider}</div>
        </div>
        <div class="review-item">
            <div class="review-label">Training Period</div>
            <div>${formData.startDate} to ${formData.endDate}</div>
        </div>
    `;
}

async function handleSubmit(e) {
    e.preventDefault();

    collectFormData();

    try {
        const trackingNumber = generateTrackingNumber();

        const submissionData = {
            tracking_number: trackingNumber,
            employee_name: formData.fullName,
            employee_number: formData.employeeNumber,
            job_title: formData.jobTitle,
            department: formData.department,
            email_address: formData.emailAddress,
            mobile_number: formData.mobileNumber,
            training_title: formData.trainingTitle,
            service_provider: formData.serviceProvider,
            training_type: formData.trainingType,
            reason_for_training: formData.reasonForTraining,
            expected_improvement: formData.expectedImprovement,
            total_cost: (
                parseFloat(formData.courseFee || 0) +
                parseFloat(formData.travelExpenses || 0)
            ).toFixed(2),
            submitted_at: new Date().toISOString(),
            status: 'pending'
        };

        console.log("Submitting data:", submissionData);

        showSuccessPopup(trackingNumber);

    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting request. Please try again.');
    }
}

function generateTrackingNumber() {
 
    return "TR-" + Math.floor(100000 + Math.random() * 900000);
}

function showSuccessPopup(trackingNumber) {
    document.getElementById("trackingNumber").textContent = trackingNumber;
    document.getElementById("successMessage").classList.add("show");
}

document.getElementById("submitAnotherBtn").addEventListener("click", function () {
    document.getElementById("successMessage").classList.remove("show");
    document.getElementById("trainingForm").reset();
    Object.keys(formData).forEach(key => delete formData[key]);

    currentStep = 1;
    showStep(currentStep);
    updateStepIndicator();
});

function showSuccessPopup(trackingNumber) {
    document.getElementById("trackingNumber").textContent = trackingNumber;
    const popup = document.getElementById("successMessage");
    popup.classList.add("show");
}
document.getElementById("submitAnotherBtn").addEventListener("click", function () {
    const popup = document.getElementById("successMessage");

    popup.classList.add("hide");

    setTimeout(() => {
        popup.classList.remove("show", "hide");

        document.getElementById("trainingForm").reset();
        Object.keys(formData).forEach(key => delete formData[key]);

        currentStep = 1;
        showStep(currentStep);
        updateStepIndicator();
    }, 400); 
});

document.addEventListener("DOMContentLoaded", function () {
    const submitAnotherBtn = document.getElementById("submitAnotherBtn");

    function generateTrackingNumber() {

        return "TR-" + Math.floor(100000 + Math.random() * 900000);
    }

    window.showSuccessPopup = function (trackingNumber) {
        document.getElementById("trackingNumber").textContent = trackingNumber;
        document.getElementById("successMessage").classList.add("show");
    };

    submitAnotherBtn.addEventListener("click", function () {
      
        document.getElementById("successMessage").classList.remove("show");

        document.getElementById("trainingForm").reset();
        Object.keys(formData).forEach(key => delete formData[key]);

        currentStep = 1;
        showStep(currentStep);
        updateStepIndicator();
    });
});

document.getElementById("doneBtn").addEventListener("click", function () {
  const popup = document.getElementById("successMessage");
  popup.classList.add("hide");

  // Fade out popup smoothly
  setTimeout(() => {
    popup.classList.remove("show", "hide");

    launchFireworks();

    setTimeout(() => {
      document.querySelector(".container").innerHTML = `
        <div class="celebration-card">
          <h1 class="celebration-title">🎉 Completed!</h1>
          <p class="celebration-text">Your Training Request has been successfully finalized.</p>
        </div>
      `;
    }, 2000);
  }, 400); 
});

// 🎆 Fireworks effect
function launchFireworks() {
  for (let i = 0; i < 40; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * 100 + 'vw';
    firework.style.top = Math.random() * 80 + 'vh';
    firework.style.backgroundColor = randomColor();
    document.body.appendChild(firework);

    setTimeout(() => firework.remove(), 1200);
  }
}

function randomColor() {
  const colors = ['#2563eb', '#facc15', '#9ca3af', '#ef4444', '#10b981'];
  return colors[Math.floor(Math.random() * colors.length)];
}


showStep(1);


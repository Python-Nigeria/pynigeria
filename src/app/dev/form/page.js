import React from "react";

export default function Page(){
  return(
    <div>
      <div class="container py-5">
<div class="text-center mb-4">
    <h1 class="fw-bold color-p display-5">         <span class="brand-mark hide d-none coor-bg-p d-inline-flex align-items-center justify-content-center rounded-circle p-1">
          <i class="fas fa-dev"></i>
        </span> Dev of the Week  </h1>
    <p class="text-muted">Let’s know more about you to personalize your experience</p>
  </div>
  
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body p-4">
          <h2 class="text-center sz-24 mb-4 fw-semibold"> Input </h2>

        
          <div class="alert alert-danger">
            
          </div>
        
          <form method="post" 
                hx-post="{% url 'user_detail' form %}" 
                hx-swap="outerHTML" 
                hx-target="body" 
                hx-push-url="true">
            

            
              <div class="mb-3">
                <label class="form-label fw-medium">Select your role</label>
                <select name="role" class="form-select form-p">
                  <option value="" disabled selected>Choose your role</option>
                  <option value="Teacher">Teacher</option>
                  <option value="School Administration">School Administration</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            
              <div class="mb-3">
                <label class="form-label fw-medium"></label>
                <input type="text" name="{{ form }}" class="form-control form-p rounded-3" placeholder="" />
              </div>

            <button type="submit" class="btn btn-primary color-bg-p w-100 form-p my-2 rounded-3 fw-semibold no-border form-p">
              Next
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
</div>
    </div>
    )
}

import { css } from  'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js';
export const buttonStyles = css `

table{
    margin:5px;
    width:100%;
  }
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  
  .btn-check {
    position: absolute;
    clip: rect(0,0,0,0);
    pointer-events: none;
}
.btn-check.focus .btn-check:focus{
  background-color: blue;    
  box-shadow: 0 0 0 0.2rem rgb(108 117 125 / 50%);
}

.btn-outline-success:hover {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}

.btn-outline-success:not(:disabled):not(.disabled).active, .btn-outline-success:not(:disabled):not(.disabled):active, .show>.btn-outline-success.dropdown-toggle {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}

.btn-outline-success.focus, .btn-outline-success:focus {
    box-shadow: 0 0 0 0.2rem rgb(40 167 69 / 50%);
}

 
put[type="radio" i] {
  background-color: initial;
  cursor: default;
  appearance: auto;
  box-sizing: border-box;
  margin: 3px 3px 0px 5px;
  padding: initial;
  border: initial;
}
.btn {
--bs-btn-padding-x: .25rem;
--bs-btn-padding-y: .25rem;
--bs-btn-font-family: ;
--bs-btn-font-size: .58rem;
--bs-btn-font-weight: 400;
--bs-btn-line-height: 1.5;
--bs-btn-color: #212529;
--bs-btn-bg: transparent;
--bs-btn-border-width: 1px;
--bs-btn-border-color: transparent;
--bs-btn-border-radius: 0.375rem;
--bs-btn-hover-border-color: transparent;
--bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),0 1px 1px rgba(0, 0, 0, 0.075);
--bs-btn-disabled-opacity: 0.65;
--bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);
display: inline-block;
padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
font-family: var(--bs-btn-font-family);
font-size: var(--bs-btn-font-size);
font-weight: var(--bs-btn-font-weight);
line-height: var(--bs-btn-line-height);
color: var(--bs-btn-color);
text-align: center;
text-decoration: none;
vertical-align: middle;
cursor: pointer;
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
border-radius: var(--bs-btn-border-radius);
background-color: var(--bs-btn-bg);
transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
box-sizing: border-box;


&:focus,
&.focus {
  outline: 0;
  box-shadow: $btn-focus-box-shadow;
}

// Disabled comes first so active can properly restyle
&.disabled,
&:disabled {
  opacity: $btn-disabled-opacity;
  @include box-shadow(none);
}

&:not(:disabled):not(.disabled) {
  cursor: if($enable-pointer-cursor-for-buttons, pointer, null);

  &:active,
  &.active {
    @include box-shadow($btn-active-box-shadow);

    &:focus {
      @include box-shadow($btn-focus-box-shadow, $btn-active-box-shadow);
    }
  }
}
}


.btn-outline-success {
--bs-btn-color: #198754;
--bs-btn-border-color: #198754;
--bs-btn-hover-color: #fff;
--bs-btn-hover-bg: #198754;
--bs-btn-hover-border-color: #198754;
--bs-btn-focus-shadow-rgb: 25,135,84;
--bs-btn-active-color: #fff;
--bs-btn-active-bg: #198754;
--bs-btn-active-border-color: #198754;
--bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
--bs-btn-disabled-color: #198754;
--bs-btn-disabled-bg: transparent;
--bs-btn-disabled-border-color: #198754;
--bs-gradient: none;
}
.btn-check:checked+.btn, .btn.active, .btn.show, .btn:first-child:active, :not(.btn-check)+.btn:active {
color: var(--bs-btn-active-color);
background-color: var(--bs-btn-active-bg);
border-color: var(--bs-btn-active-border-color);
}


  
  `;
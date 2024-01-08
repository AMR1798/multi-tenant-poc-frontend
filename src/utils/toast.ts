import Swal, {
  type SweetAlertIcon,
  type SweetAlertPosition,
} from "sweetalert2";

const toast = (
  text: string,
  title: string,
  icon: SweetAlertIcon,
  background = '#fff',
  position: SweetAlertPosition = "top-end",
  showConfirmButton = false,
  timer = 2000,
  timerProgressBar = true
) => {
  Swal.fire({
    toast: true,
    position,
    showConfirmButton,
    title,
    text,
    timerProgressBar,
    icon,
    background,
    timer,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
      toast.addEventListener('click', ()=> Swal.close());
    },
  });
};

export default toast;

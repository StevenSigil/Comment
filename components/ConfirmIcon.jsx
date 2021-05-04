import { ReactComponent as ConfIcon } from "../public/static/icons/checkCircle.svg";

export default function ConfirmIcon() {
  return (
    <div className="confirmDiv">
      <ConfIcon />
    </div>
  );
}

/**
 * Toggles the className on animated OK div responsible for starting then
 * clearing animation on dom
 */
export function toggleConfAnim() {
  const confDiv = document.querySelector(".confirmDiv");
  confDiv.classList.toggle("confirmDiv-anim");
  setTimeout(() => {
    confDiv.classList.toggle("confirmDiv-anim");
  }, 2000);
}

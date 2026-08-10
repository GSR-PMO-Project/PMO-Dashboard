import gsrLogo from "../../assets/GSRSymbol.png";

function LoadingSpinner({ text = "Loading...", fullPage = false }) {
  return (
    <div className={`loading-spinner${fullPage ? " loading-spinner-full" : ""}`}>
      <img src={gsrLogo} alt="GSR" className="loading-spinner-logo" />
      {text && <p>{text}</p>}
    </div>
  );
}

export default LoadingSpinner;

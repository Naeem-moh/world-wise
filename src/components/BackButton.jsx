import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={(e) => {
        navigate(-1);
        e.preventDefault();
      }}
      type="back"
    >
      Back
    </Button>
  );
}

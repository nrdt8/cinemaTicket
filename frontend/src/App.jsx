import "./styles/main.scss"
import SessionCard from "./components/ui/SessionCard/SessionCard.jsx";

function App() {
  return (
    <>
        <SessionCard price={350} hall={"Огромный зал"} color={"green"} startTime={"11:00"} endTime={"13:22"}></SessionCard>
        <SessionCard price={900} hall={"VIP"} color={"red"} startTime={"12:20"} endTime={"14:42"}></SessionCard>
        <SessionCard price={240} hall={"VIP"} color={"red"} startTime={"12:20"} endTime={"14:42"}></SessionCard>
        <SessionCard price={450} hall={"Комфорт"} color={"yellow"} startTime={"12:20"} endTime={"14:42"}></SessionCard>
    </>
  )
}

export default App

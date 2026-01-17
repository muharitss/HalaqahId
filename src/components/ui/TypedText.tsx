import { ReactTyped } from "react-typed";

export default function Title() {
  return (
    <h1 className="text-2xl font-semibold">
      <ReactTyped
        strings={["Laporan Setoran Hafalan Santri"]}
        typeSpeed={60}
        backSpeed={22}
        backDelay={2800}
        loop
        showCursor={true}
      />
    </h1>
  );
}

export const Titleas = () => {
  return (
    <h1 className="text-2xl font-semibold">
      <ReactTyped
        strings={["Laporan Setoran Hafalan Santri"]}
        typeSpeed={60}
        backSpeed={22}
        backDelay={2800}
        loop
        showCursor={true}
      />
    </h1>
  );
}

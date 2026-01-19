import { ReactTyped } from "react-typed";

export default function Laporan() {
  return (
    <h1 className="text-3xl font-semibold">
      <ReactTyped
        strings={["Laporan Setoran"]}
        typeSpeed={60}
        backSpeed={32}
        backDelay={2800}
        loop
        showCursor={true}
      />
    </h1>
  );
}

export const HalaqahManagement = () => {
  return (
    <h1 className="text-3xl font-semibold">
      <ReactTyped
        strings={["Kelola Halaqah"]}
        typeSpeed={60}
        backSpeed={32}
        backDelay={2800}
        loop
        showCursor={true}
      />
    </h1>
  );
}

export const Settings = () => {
  return (
    <h1 className="text-3xl font-semibold">
      <ReactTyped
        strings={["Pengaturan"]}
        typeSpeed={60}
        backSpeed={32}
        backDelay={2800}
        loop
        showCursor={true}
      />
    </h1>
  );
}

export const MuhafizManagement = () => {
  return (
    <h1 className="text-3xl font-semibold">
      <ReactTyped
        strings={["Kelola Muhafiz"]}
        typeSpeed={60}
        backSpeed={32}
        backDelay={2800}
        loop
        showCursor={true}
      />
    </h1>
  );
}

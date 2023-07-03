import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Chart from "./components/Chart";

function App() {
  const [path, setpath] = useState("");
  const [status, setstatus] = useState(false);
  const [stopped, setstopped] = useState(true);
  const openDialog = async () => {
    const dirpath = await api.openDirectory();
    console.log(dirpath);
    setpath(dirpath);
    return dirpath;
  };
  const startServer = async (dirpath) => {
    const status = await api.startServer(dirpath);
    setstatus(true);
    console.log(status);
  };
  const handleStart = async () => {
    const dirpath = await openDialog();
    startServer(dirpath);
  };
  return (
    <div className="m-2 mt-4 flex flex-col space-y-4">
      <h1 className="font-bold text-teal-600 dark:text-teal-400 text-2xl text-center">
        File Server
      </h1>
      <h2 className="dark:text-white flex space-x-2">
        <span>Status :</span>{" "}
        <Chart
          className={`h-6 w-6 ${status ? "text-green-600" : "text-red-600"}`}
        />
        <span>{status ? "Connected" : "Offline"}</span>
      </h2>
      {status && (
        <div>
          <p className="dark:text-white bg-slate-400 dark:bg-slate-700 p-2 rounded-xl pl-4">
            {path}
          </p>
        </div>
      )}

      <div className="flex text-white">
        {!status && stopped ? (
          <button
            className="h-16 w-20 bg-indigo-600 rounded-xl mx-auto focus:outline-none"
            onClick={handleStart}
          >
            Start
          </button>
        ) : (
          <button
            className="h-16 w-20 bg-indigo-600 rounded-xl mx-auto"
            onClick={async () => {
              setstopped(await api.stopServer());
              setstatus(false);
            }}
          >
            Stop
          </button>
        )}
      </div>
      {/* <div>
        <h2 className="dark:text-white">Hosts</h2>
        <ul className="dark:text-white">
        {window.api.hosts().map((host) => (
          <li key={host}>{host}</li>
          ))}
          </ul>
        </div> */}
      {status && (
        <span className="mx-auto p-4 dark:bg-slate-200 ">
          {status && (
            <QRCodeSVG value={`http://${window.api.hosts()[0]}:3000/`} />
          )}
        </span>
      )}
      <div className="text-center">
        {status && (
          <span
            className="rounded-lg w-auto bg-indigo-300 p-2"
            // href={`http://${window.api.hosts()[0]}:3000/`}
          >
            http://{window.api.hosts()[0]}:3000/
          </span>
        )}
      </div>
    </div>
  );
}

export default App;

{
  /* <button className="bg-indigo-300" onClick={openDialog}>
  Open
</button> */
}

// components/CallSystem.tsx
import { useState, useEffect } from "react";
import axios from "axios";

const CallSystem = () => {
    const [activeCalls, setActiveCalls] = useState<{ id: string; number: string; status: string }[]>([]);
    const [extension, setExtension] = useState("");
    const [route, setRoute] = useState("");

    useEffect(() => {
        axios.get("http://localhost:9000/calls")
            .then(response => setActiveCalls(response.data as { id: string; number: string; status: string }[]))
            .catch(error => console.error(error));
    }, []);

    const handleCallAction = (command: string) => {
        axios.post("http://localhost:9000", { command })
            .then(response => console.log(response.data))
            .catch(error => console.error(error));
    };

    return (
        <div className="p-6 space-y-4">
            {/* Dashboard */}
            <div className="p-4 border rounded">
                <h2 className="text-xl font-bold">Active Calls</h2>
                <ul>
                    {activeCalls.map((call) => (
                        <li key={call.id} className="border-b py-2">
                            📞 {call.number} - <span className="text-gray-500">{call.status}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Call Controls */}
            <div className="flex gap-4">
                <button onClick={() => handleCallAction("call:answer")} className="p-2 bg-green-500 rounded">📞 Answer</button>
                <button onClick={() => handleCallAction("call:hangup")} className="p-2 bg-red-500 rounded">❌ Hang Up</button>
                <button onClick={() => handleCallAction("call:transfer")} className="p-2 bg-blue-500 rounded">🔄 Transfer</button>
            </div>

            {/* Settings */}
            <div className="p-4 border rounded">
                <h2 className="text-xl font-bold">Settings</h2>
                <input value={extension} onChange={(e) => setExtension(e.target.value)} placeholder="Extension" className="border p-2 w-full" />
                <input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="Route" className="border p-2 w-full mt-2" />
                <button onClick={() => handleCallAction(`config:${extension}-${route}`)} className="p-2 mt-2 bg-blue-500 rounded w-full">Save</button>
            </div>
        </div>
    );
};

export default CallSystem;

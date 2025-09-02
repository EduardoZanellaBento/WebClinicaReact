

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ChoosePatient() {
    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-green-100">
            <Card className="w-full max-w-xs p-2 bg-green-200 shadow-md flex items-center">
                <Input
                    type="text"
                    placeholder="digite o nome do paciente"
                    className="bg-green-200 text-gray-700 placeholder-gray-500 border-none shadow-none focus:outline-none focus:ring-0"
                />
            </Card>
        </div>
    );
}

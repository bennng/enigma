import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  const { mode, message, rotors, rotorPositions, ringSettings, plugboard, reflector } = await request.json();

  const scriptPath = path.resolve('./enigma/enigma.py');
  const pythonPath = path.resolve('./enigma/venv/bin/python3');

  const args = [scriptPath, mode, message, ...rotors, ...rotorPositions, ...ringSettings, reflector];

  const plugboardSettings = JSON.stringify(plugboard);
  if (plugboardSettings) {
    args.push(plugboardSettings);
  }

  const enigmaProcess = spawn(pythonPath, args);

  return new Promise((resolve, reject) => {
    let result = '';
    enigmaProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    enigmaProcess.stderr.on('data', (data) => {
      console.error('Error:', data.toString());
      reject(NextResponse.json({ error: data.toString() }));
    });

    enigmaProcess.on('close', (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ result }));
      } else {
        reject(NextResponse.json({ error: 'Process exited with non-zero status code' }));
      }
    });
  });
}

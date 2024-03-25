import * as core from '@actions/core';
import fs from 'fs';
import crypto from 'crypto';

async function run(): Promise<void> {
    try {
        const pluginName = core.getInput('pluginName', {required:true});
        const pluginJar = core.getInput('pluginJar', {required:true});
        const pluginClassPath = core.getInput('pluginClassPath', {required:true});
        const pluginFolder = core.getInput('pluginFolder', {required:true});
        const pluginDescription = core.getInput('pluginDescription', {required: false})

        let pluginsFile = fs.readFileSync("plugins.json", 'utf8');
        let pluginsData = JSON.parse(pluginsFile);

        if (!Array.isArray(pluginsData)) {
            pluginsData = [];
        }

        let jarFile = fs.readFileSync(pluginJar);
        const sha256Hash = crypto.createHash('sha256').update(jarFile).digest('hex');
        const fileSizeInBytes = fs.statSync(jarFile).size;

        const pluginJson = {
            internalName: pluginFolder,
            hash: sha256Hash,
            size: fileSizeInBytes,
            plugins: [
              pluginClassPath
            ],
            displayName: pluginName,
            description: pluginDescription ? pluginDescription : "",
            provider: pluginFolder
        }

        const filteredData = pluginsData.filter((item: any) => item.internalName !== pluginFolder);
        filteredData.push(pluginJson)

        pluginsData = JSON.stringify(filteredData, null, 2);

        fs.writeFileSync(pluginsFile, pluginsData, 'utf8');
    } catch(error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

run();
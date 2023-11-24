import { join } from 'path';
import { readdirSync, lstatSync } from 'fs';
import { Collection } from 'discord.js';

// export async function loadCommands(
//     base: string
// ): Promise<Collection<string, SlashCommand>> {
//     const commands = new Collection<string, SlashCommand>();
//     const dirPath = join(__dirname, '..', base);
//     const files = readdirSync(dirPath)
//         .filter(file => file.endsWith('.ts'))
//         .map(async file => {
//             const { command }: { command: SlashCommand } = await import(
//                 join(dirPath, file)
//             );
//             commands.set(command.builder.name, command);
//         });
//     await Promise.all(files);
//     Logger.info('commands fetched');

//     return commands;
// }

function traverseFS(root: string, callback: (path: string) => Promise<void>) {
    const dig = async (path: string) => {
        const childs = readdirSync(path).map(async file => {
            const absolute = join(path, file);
            if (lstatSync(absolute).isDirectory()) {
                return dig(absolute);
            }

            await callback(absolute);
        });

        await Promise.all(childs);
    };

    return dig(root);
}

type NamedResource<T> = T & { name: string };

export async function loadResources<T>(
    root: string
): Promise<Collection<string, NamedResource<T>>> {
    const resources = new Collection<string, NamedResource<T>>();

    await traverseFS(root, async path => {
        const resource = (await import(path)).default as NamedResource<T>;
        resources.set(resource.name, resource);
    });

    return resources;
}

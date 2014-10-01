# clean-bower-installer
This tool permit to install bower dependencies without including the entire repos. This tool add a way to specify and take only what you really need form all the files bower get.

It also support smart file update so only the needed files be update/rewrite when you run this tool.

## Requirement
- Have node.js install
- Have bower install

## How to install
You can install clean-bower-installer by executing
```
npm install -g clean-bower-installer
```

## How to run it
From the folder where your bower.json file is, run this command:
```
clean-bower-installer
```

## List of commands

| Command | Result |
|---------|--------|
| install | Run the command "bower install" before execute clean-bower-installer. |
| update  | Run the command "bower update" before execute clean-bower-installer. |
| < path to bower.json file > | By entering the relative path to the bower.json file you can run the command from a different folder than the one containing the bower.json file. |

## Options
WIP

## API
WIP
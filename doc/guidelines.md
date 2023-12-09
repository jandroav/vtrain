# :guide_dog: CLI guidelines

Here are some useful recommendations and conventions for building effective CLI tools from:

* [NIXOS CLI guideline](https://nixos.org/manual/nix/stable/contributing/cli-guideline.html)
* [Atlassian 10 design principles for delightful CLIs](https://blog.developer.atlassian.com/10-design-principles-for-delightful-clis/)
* [Command Line Interface Guidelines](https://clig.dev)
* [Heroku CLI Style Guide](https://devcenter.heroku.com/articles/cli-style-guide)

## Arguments and Flags

Arguments, or args, are positional parameters to a command. For example, the file paths you provide to `cp` are args. The order of args is often important: `cp foo bar` means something different from `cp bar foo`.

Flags are named parameters, denoted with either a hyphen and a single-letter name (`-r`) or a double hyphen and a multiple-letter name (`--recursive`). They may or may not also include a user-specified value (`--file foo.txt`, or `--file=foo.txt`). The order of flags, generally speaking, does not affect program semantics.

**Prefer flags to args**. It’s a bit more typing, but it makes it much clearer what is going on. It also makes it easier to make changes to how you accept input in the future. Sometimes when using args, it’s impossible to add new input without breaking existing behavior or creating ambiguity.

## Subcommands

If you’ve got a tool that’s sufficiently complex, you can reduce its complexity by making a set of subcommands. If you have several tools that are very closely related, you can make them easier to use and discover by combining them into a single command (for example, RCS vs. Git).

They’re useful for sharing stuff—global flags, help text, configuration, storage mechanisms.

Be consistent across subcommands. Use the same flag names for the same things, have similar output formatting, etc.

Use consistent names for multiple levels of subcommand. If a complex piece of software has lots of objects and operations that can be performed on those objects, it is a common pattern to use two levels of subcommand for this, where one is a noun and one is a verb. For example, docker container create. Be consistent with the verbs you use across different types of objects.

## Naming

Either `noun verb or verb noun` ordering works, but `noun verb` seems to be more common.

Don’t have ambiguous or similarly-named commands. For example, having two subcommands called “update” and “upgrade” is quite confusing. You might want to use different words, or disambiguate with extra words.

```bash
vtrain <COMMAND> <SUBCOMMAND> [<ARGUMENTS>] [<OPTIONS>]
```

* **COMMAND**, **ARGUMENTS** and **OPTIONS** should be lowercase and in a singular form.
* **COMMAND** should be a **NOUN**.
* **SUBCOMMAND** should be a **VERB**.
* **ARGUMENTS** and **OPTIONS** are discussed in Input section.

### Input 
Input to a command is provided via **ARGUMENTS** and **OPTIONS**.

**ARGUMENTS** represent a required input for a function. When choosing to use **ARGUMENTS** over **OPTIONS** please be aware of the downsides that come with it:

* User will need to remember the order of **ARGUMENTS**. This is not a problem if there is only one **ARGUMENT**.
* With **OPTIONS** it is possible to provide much better auto completion.
* With **OPTIONS** it is possible to provide much better error message.
* Using **OPTIONS** it will mean there is a little bit more typing.

#### Naming the OPTIONS

The only naming convention - apart from the ones mentioned in Naming the **COMMANDS** section is how flags are named.

Flags are a type of **OPTION** that represent an option that can be turned `ON` of `OFF`. We can say flags are boolean type of **OPTION**.

Here are few examples of flag **OPTIONS**:

```bash
--colors vs. --no-colors (showing colors in the output)
--emojis vs. --no-emojis (showing emojis in the output)****
```

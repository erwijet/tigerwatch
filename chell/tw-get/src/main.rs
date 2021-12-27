use structopt::StructOpt;

// #[derive(StructOpt)]
// struct Cli {
//     #[structopt(parse(from_os_str))]
//     command: std::path::PathBuf,
// }

trait Selectable {
    fn select_chars(&self, chrs: [char]) -> &String;
}

impl Selectable for String {
    fn select_chars(&self, chrs: [char]) -> &String {
        return "";
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("{}", "hello, world");
    Ok(())
}

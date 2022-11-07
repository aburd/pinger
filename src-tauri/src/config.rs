pub struct Config;

impl Config {
    pub fn new() -> Self {
        Config {}
    }

    pub fn load() -> Result<Config, String> {
        unimplemented!("load config")
    }
}

impl Config {
    pub fn save(&self) -> Result<(), String> {
        unimplemented!("save config")
    }
}

use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::default::Default;
use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;

#[derive(Deserialize, Serialize)]
pub struct Config {
    path: PathBuf,
    app_path: PathBuf,
    log_path: PathBuf,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            path: CONFIG_PATH.into(),
            app_path: DEFAULT_APP_PATH.into(),
            log_path: DEFAULT_LOG_PATH.into(),
        }
    }
}

static CONFIG_PATH: &str = "$HOME/.pingerrc";
static DEFAULT_APP_PATH: &str = "$HOME/.config/pinger";
static DEFAULT_LOG_PATH: &str = "$HOME/.config/pinger/logs";

impl Config {
    pub fn new(app_path: String, log_path: String) -> Self {
        Config {
            path: CONFIG_PATH.into(),
            app_path: app_path.into(),
            log_path: log_path.into(),
        }
    }

    pub fn load() -> Result<Config, String> {
        let mut buf = String::new();
        let mut f: File = File::open(CONFIG_PATH).or_else(|e| {
            eprintln!("Config file not found: {}.", e);
            Config::create_init_file()
        })?;
        f.read_to_string(&mut buf).map_err(|e| e.to_string())?;

        Config::try_from(buf.as_str())
            .map_err(|e| format!("Config file is not formatted correctly: {}", e))
    }

    fn create_init_file() -> Result<File, String> {
        let mut f = File::create(CONFIG_PATH).unwrap();
        let c = Config::default();
        c.save(&mut f)?;
        Ok(f)
    }
}

impl Config {
    pub fn save(&self, f: &mut File) -> Result<(), String> {
        let s = serde_json::to_string(self).unwrap();
        f.write(s.as_bytes()).unwrap();
        Ok(())
    }
}

impl TryFrom<&str> for Config {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        serde_json::from_str(s).map_err(|e| e.to_string())
    }
}

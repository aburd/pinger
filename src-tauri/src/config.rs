use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::default::Default;
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Write};
use std::path::PathBuf;

#[derive(Clone, Deserialize, Serialize)]
pub struct Config {
    path: PathBuf,
    pub app_dir: PathBuf,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            path: default_config_path(),
            app_dir: default_app_dir(),
        }
    }
}

fn default_app_dir() -> PathBuf {
    let home_dir = home::home_dir().unwrap();
    home_dir.join(".config/pinger")
}
fn default_config_path() -> PathBuf {
    let app_dir = default_app_dir();
    app_dir.join(".pingerrc")
}

impl Config {
    pub fn load() -> Result<Config, String> {
        let mut buf = String::new();
        let mut f: File = Config::load_config_file()?;
        f.read_to_string(&mut buf).map_err(|e| e.to_string())?;

        Config::try_from(buf.as_str())
            .map_err(|e| format!("Config file is not formatted correctly: {}", e))
    }

    fn load_config_file() -> Result<File, String> {
        OpenOptions::new()
            .read(true)
            .open(default_config_path())
            .or_else(|e| {
                eprintln!("Config file not found: {}.", e);
                Config::create_init_file()
            })
    }

    fn create_init_file() -> Result<File, String> {
        let c = Config::default();
        fs::create_dir_all(&c.app_dir).unwrap();

        let f = c.save()?;
        Ok(f)
    }
}

impl Config {
    pub fn save(&self) -> Result<File, String> {
        let mut f = OpenOptions::new()
            .write(true)
            .create(true)
            .open(&self.path)
            .map_err(|e| e.to_string())?;
        let s = serde_json::to_string(self).unwrap();
        f.write_all(s.as_bytes()).unwrap();
        Ok(f)
    }
}

impl TryFrom<&str> for Config {
    type Error = String;

    fn try_from(s: &str) -> Result<Self, Self::Error> {
        serde_json::from_str(s).map_err(|e| e.to_string())
    }
}

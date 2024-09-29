# HackYeah 2024 - Go [BreakWordTraps] FinTax

App developed to assist in detecting issues with public performances and speeches. After uploading an .mp4 video file, the app will analyze the speech and provide a feedback on the quality of the speech, as well as the potential issues.

Software stack consists of a Flask backend connected to a custom job scheduler (`app/job_manager`) running media procesing pipelines concurently. All analysis modules placed in the `app/modules` submodule and are designed in an modular fashion. Pipeline description is located at `job.yaml`. In future the job manager component processing throughput could be improved by spinning more instances. The frontend is based on React framework allowing end user to interact with analyzed data.
.
Developed during the HackYeah 2024 hackathon.

## Setup

Repo setup:
```sh
git clone https://github.com/spejsiaczki/hy_app.git
git submodule update --init --recursive
```

Python dependencies:
```sh
python -m venv .venv
source .venv/bin/activate
pip install -r app/modules/requirements.txt
```

Start the app:
```sh
cd app
flask run
```

Additionaly a Docker container recipe is provided, app by default will listen the `5000` port.


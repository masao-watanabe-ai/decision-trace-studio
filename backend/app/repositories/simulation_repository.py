from app.schemas.simulation import SimulationRun

_store: dict[str, SimulationRun] = {}


class SimulationRepository:
    def save(self, run: SimulationRun) -> None:
        _store[run.id] = run

    def get(self, simulation_id: str) -> SimulationRun:
        if simulation_id not in _store:
            raise KeyError(f"SimulationRun {simulation_id!r} not found")
        return _store[simulation_id]

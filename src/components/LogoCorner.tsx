
import { useNavigate } from 'react-router-dom';

export default function LogoCorner() {
    const navigate = useNavigate();
    return (
        <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 50 }}>
            <img
                src="/src/assets/react.svg"
                alt="Logo da empresa"
                style={{ width: 48, height: 48, cursor: 'pointer' }}
                onClick={() => navigate('/ChoosePatient')}
            />
        </div>
    );
}

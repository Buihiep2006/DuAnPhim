import { useEffect, useRef } from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function GoogleAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { completeGoogleLogin } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;

    try {
      const token = searchParams.get('token');
      const encodedUser = searchParams.get('user');

      if (!token || !encodedUser) {
        window.location.replace('/login?googleError=true');
        return;
      }

      const normalized = encodedUser.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      const user = JSON.parse(json);

      completeGoogleLogin(token, user);

      // Force a hard redirect after persisting auth state so the app reloads
      // into the normal customer flow without callback-page re-entry.
      window.location.replace('/');
    } catch (error) {
      window.location.replace('/login?googleError=true');
    }
  }, [searchParams, completeGoogleLogin]);

  return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="danger" className="mb-3" />
      <Alert variant="light" className="d-inline-block">
        Đang hoàn tất đăng nhập Google...
      </Alert>
    </Container>
  );
}

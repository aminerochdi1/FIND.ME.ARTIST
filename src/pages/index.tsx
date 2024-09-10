import { ServerSide } from '@/sides/server/ServerSide';

export default function NoThing() { return (<></>) }
export async function getServerSideProps(context: any) {
    return ServerSide.getRedirectionWithoutLanguage(context);
}

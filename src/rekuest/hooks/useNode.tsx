import { Reservation, usePostman } from "@jhnnsrs/rekuest-next"
import { useCallback } from "react"
import { PostmanReservationFragment, useReservationsQuery } from "../api/graphql"
import { withRekuest } from "@jhnnsrs/rekuest"



export const useUsage = (options: {hash: string}): [PostmanReservationFragment | undefined, () => void ] => {


    const {data} = withRekuest(useReservationsQuery)({
        variables: {
            instanceId: "default"
        }
    })


    const isUsed = data?.myreservations.find(r => r.node.hash == options.hash)



    const toggle = useCallback(() => {

        console.log(isUsed ? "Unreserving": "Reserving")

        





    }, [options.hash, isUsed])

    return [isUsed, toggle]
}
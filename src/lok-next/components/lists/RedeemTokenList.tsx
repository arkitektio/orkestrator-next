import { ListRender } from "@/components/layout/ListRender";
import { LokRedeemToken } from "@/linkers";

import {
  OffsetPaginationInput,
  RedeemTokenFilter,
  useRedeemTokensQuery,
} from "@/lok-next/api/graphql";
import { withLokNext } from "@jhnnsrs/lok-next";
import RedeemTokenCard from "../cards/RedeemTokenCard";

export type Props = {
  filters?: RedeemTokenFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withLokNext(
    useRedeemTokensQuery,
  )({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.redeemTokens}
      title={
        <LokRedeemToken.ListLink className="flex-0">
          Token
        </LokRedeemToken.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <RedeemTokenCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;

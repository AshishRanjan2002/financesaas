import { InferRequestType,InferResponseType  } from "hono";
import {toast} from "sonner";
import {useMutation,useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

type ResponseType=InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType=InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories=()=>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn:async (json)=>{
            const response =await client.api.categories["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess:()=>{
            toast.success("Categories deleted successfully");
            queryClient.invalidateQueries({queryKey:["categories"]});  //refreshing categories
            queryClient.invalidateQueries({queryKey:["summary"]});  

            //This will refetch all the accounts everytime we create new accounts
        },
        onError:()=>{
            toast.error("Failed to delete categories");
        }

    
    });

    return mutation;
}
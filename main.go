package main

import (
	"fmt"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

func main() {
	config := oauth1.NewConfig("Ft5kAkn7sHnB37kUBY5QTbICr", "o9cwZQmlzD9w0EYJNkAXPVufGZWqCLb281iLU417bmhdGRI0kx")
	token := oauth1.NewToken("800117847774986240-QqjFVCDUNR2CwdagyM98jVgeMq7XP7x", "b2weC2a2Jl4zCXXaNllhHiDbgjoljup33gDLSzDFOBb3E")
	httpClient := config.Client(oauth1.NoContext, token)

	// Twitter client
	client := twitter.NewClient(httpClient)

	// Home Timeline
	tweets, _, err := client.Timelines.HomeTimeline(&twitter.HomeTimelineParams{
		Count: 1000,
	})
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println("RESP:\n", resp)
	count := 0
	for _, tweet := range tweets {
		fmt.Printf("%d tweet: %s\n", count, tweet.Text)
		count += 1
	}

	// demux := twitter.NewSwitchDemux()
	// demux.Tweet = func(tweet *twitter.Tweet) {
	// 	fmt.Println(tweet.Text)
	// }
	// fmt.Println("DEMUX TWT\n\n")
	// for _, tweet := range tweets {
	// 	demux.Handle(tweet)
	// }

}
